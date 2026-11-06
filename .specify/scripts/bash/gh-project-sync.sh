#!/usr/bin/env bash
# Sincroniza tarefas de tasks.md com issues e cards do GitHub Projects.
#
#   gh-project-sync.sh ensure [tasks.md]       cria issues que faltam e põe todas no Project
#   gh-project-sync.sh move T017 <status>      status: backlog | in-progress | done
#   gh-project-sync.sh sync [tasks.md]         tarefas [x] -> Done (recupera atrasos)
#
# Requer `gh` autenticado com o escopo `project` (gh auth refresh -s project).
# Nunca falha o comando que o chamou por causa do GitHub: erros viram aviso e saída 0,
# exceto uso incorreto.
set -uo pipefail

CFG=".specify/github-project.yml"
[ -f "$CFG" ] || { echo "[gh-project] sem $CFG; nada a fazer" >&2; exit 0; }
cfg() { grep -E "^$1:" "$CFG" | head -1 | sed -E "s/^$1:[[:space:]]*//; s/[\"']//g; s/[[:space:]]+#.*$//"; }

REPO=$(cfg repo); OWNER=$(cfg owner); NUM=$(cfg project)
FIELD=$(cfg status_field)
S_BACKLOG=$(cfg status_backlog); S_PROG=$(cfg status_in_progress); S_DONE=$(cfg status_done)
CLOSE=$(cfg close_on_done)

warn() { echo "[gh-project] $*" >&2; }

command -v gh >/dev/null || { warn "gh não encontrado; pulando"; exit 0; }

# `gh project view/item-list` falham com "unknown owner type" em algumas versões do gh;
# por isso as leituras do Project usam GraphQL (dono do tipo usuário).
gql() { gh api graphql "$@" 2>/dev/null; }

load_project() {
  [ -n "${PID:-}" ] && return 0
  PID=$(gql -f query="{user(login:\"$OWNER\"){projectV2(number:$NUM){id}}}" --jq .data.user.projectV2.id)
  [ -n "$PID" ] || { warn "não consegui ler o Project $NUM (escopo 'project'? gh auth refresh -s project)"; return 1; }
  FJSON=$(gql -f query="{user(login:\"$OWNER\"){projectV2(number:$NUM){field(name:\"$FIELD\"){... on ProjectV2SingleSelectField{id options{id name}}}}}}" \
    --jq .data.user.projectV2.field)
  FID=$(printf '%s' "$FJSON" | sed -nE 's/^\{"id":"([^"]*)".*/\1/p')
  [ -n "$FID" ] || { warn "campo '$FIELD' não existe no Project"; return 1; }
  # Uma leitura só: issues (número, título) e itens do Project (número, id).
  ISSUES=$(gh issue list -R "$REPO" --state all --limit 1000 --json number,title,state --jq '.[]|"\(.number)\t\(.title)\t\(.state)"' 2>/dev/null)
  ITEMS=$(gql --paginate -f query="query(\$endCursor:String){user(login:\"$OWNER\"){projectV2(number:$NUM){items(first:100,after:\$endCursor){pageInfo{hasNextPage endCursor} nodes{id content{... on Issue{number}}}}}}}" \
    --jq '.data.user.projectV2.items.nodes[]|"\(.content.number)\t\(.id)"')
}

opt_id() { # nome da opção -> id
  printf '%s' "$FJSON" | grep -oE "\{\"id\":\"[^\"]*\",\"name\":\"$1\"\}" | sed -E 's/\{"id":"([^"]*)".*/\1/'
}

issue_for_task() { # T017 -> número da issue (pelo prefixo do título)
  load_project || return 0
  printf '%s\n' "$ISSUES" | awk -F'\t' -v p="$1:" 'index($2,p)==1{print $1; exit}'
}

item_for_issue() { # número -> id do item no Project (adiciona se faltar)
  load_project || return 0
  local id
  id=$(printf '%s\n' "$ITEMS" | awk -F'\t' -v n="$1" '$1==n{print $2; exit}')
  if [ -z "$id" ]; then
    local nid; nid=$(gh issue view "$1" -R "$REPO" --json id --jq .id 2>/dev/null)
    id=$(gql -f query="mutation{addProjectV2ItemById(input:{projectId:\"$PID\",contentId:\"$nid\"}){item{id}}}" --jq .data.addProjectV2ItemById.item.id)
    [ -n "$id" ] && ITEMS="$ITEMS"$'\n'"$1"$'\t'"$id"
  fi
  printf '%s' "$id"
}

feature_tasks() { echo "$(sed -nE 's/.*"feature_directory"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/p' .specify/feature.json)/tasks.md"; }

set_status() { # número, nome da opção
  load_project || return 0
  local item opt
  item=$(item_for_issue "$1"); opt=$(opt_id "$2")
  [ -n "$item" ] && [ -n "$opt" ] || { warn "issue #$1: item ou opção '$2' não encontrados"; return 0; }
  gql -f query="mutation{updateProjectV2ItemFieldValue(input:{projectId:\"$PID\",itemId:\"$item\",fieldId:\"$FID\",value:{singleSelectOptionId:\"$opt\"}}){projectV2Item{id}}}" >/dev/null \
    && echo "[gh-project] #$1 -> $2"
}

move() {
  local task="$1" st="$2" n
  n=$(issue_for_task "$task"); [ -n "$n" ] || { warn "sem issue para $task"; return 0; }
  case "$st" in
    backlog)     set_status "$n" "$S_BACKLOG" ;;
    in-progress) set_status "$n" "$S_PROG" ;;
    done)
      set_status "$n" "$S_DONE"
      if [ "$CLOSE" = "true" ]; then
        gh issue close "$n" -R "$REPO" --reason completed >/dev/null 2>&1 || true
      fi ;;
    *) echo "status inválido: $st" >&2; exit 2 ;;
  esac
}

# Linhas "- [ ] **T017** [P] [US1] texto · arquivos" -> "T017|x ou espaço|texto"
parse_tasks() {
  sed -nE 's/^- \[([ xX])\] \*\*(T[0-9]+)\*\* (.*)$/\2|\1|\3/p' "$1"
}

ensure() {
  local f="${1:-}" t desc n title url
  [ -n "$f" ] || f="$(feature_tasks)"
  [ -f "$f" ] || { warn "tasks.md não encontrado ($f)"; return 0; }
  load_project || return 0
  while IFS='|' read -r t _ desc; do
    if [ -z "$(issue_for_task "$t")" ]; then
      title="$t: ${desc%% ·*}"
      [ ${#title} -gt 100 ] && title="${title:0:97}..."
      url=$(gh issue create -R "$REPO" --title "$title" --body "$desc"$'\n\n'"Origem: \`$f\` ($t)" 2>/dev/null) || continue
      echo "[gh-project] criada $t: $url"
      ISSUES="$ISSUES"$'\n'"${url##*/}"$'\t'"$title"
    fi
    n=$(issue_for_task "$t"); [ -n "$n" ] && item_for_issue "$n" >/dev/null
  done < <(parse_tasks "$f")
}

sync() {
  local f="${1:-}" t mark n
  [ -n "$f" ] || f="$(feature_tasks)"
  load_project || return 0
  while IFS='|' read -r t mark _; do
    case "$mark" in x|X)
      # Issue já fechada = já movida; evita refazer o trabalho a cada sync.
      n=$(issue_for_task "$t")
      load_project || return 0
      printf '%s\n' "$ISSUES" | awk -F'\t' -v n="$n" '$1==n && $3=="CLOSED"{f=1} END{exit !f}' || move "$t" done ;;
    esac
  done < <(parse_tasks "$f")
}

case "${1:-}" in
  ensure) ensure "${2:-}" ;;
  move)   [ $# -eq 3 ] || { echo "uso: $0 move T### backlog|in-progress|done" >&2; exit 2; }; move "$2" "$3" ;;
  sync)   sync "${2:-}" ;;
  *) echo "uso: $0 ensure|move|sync" >&2; exit 2 ;;
esac
exit 0
