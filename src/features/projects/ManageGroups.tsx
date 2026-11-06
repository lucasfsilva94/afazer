import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { countUsage, createGroup, deleteGroup, KIND_LABEL, renameGroup, useGroups } from '../../db/groups'
import { db } from '../../db/schema'
import type { Group, GroupKind } from '../../db/types'
import { Button, IconButton } from '../../ui/Button'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { Icon } from '../../ui/Icon'
import { NameDialog } from '../../ui/NameDialog'
import { useToast } from '../../ui/Toast'

type NameState = { kind: GroupKind; group: Group | null } | null
type ConfirmState = { kind: GroupKind; group: Group; count: number } | null

const KINDS: GroupKind[] = ['project', 'category', 'tag']

function GroupSection({
  kind,
  usage,
  onCreate,
  onRename,
  onDelete,
}: {
  kind: GroupKind
  usage: Map<string, number>
  onCreate: () => void
  onRename: (g: Group) => void
  onDelete: (g: Group) => void
}) {
  const groups = useGroups(kind)
  const { one, many } = KIND_LABEL[kind]
  return (
    <section className="org-sec">
      <h3>{many}</h3>
      <ul className="org-list">
        {groups.length === 0 && <li className="muted">Nenhum {one} ainda.</li>}
        {groups.map((g) => {
          const n = usage.get(`${kind}:${g.id}`) ?? 0
          return (
            <li key={g.id} className="org-item" data-testid={`group-${kind}`}>
              <span className="nm">{g.name}</span>
              <span className="ct">{n === 1 ? '1 tarefa' : `${n} tarefas`}</span>
              <IconButton label={`Renomear ${one}: ${g.name}`} onClick={() => onRename(g)}>
                <Icon name="edit" size={20} />
              </IconButton>
              <IconButton label={`Excluir ${one}: ${g.name}`} danger onClick={() => onDelete(g)}>
                <Icon name="trash" size={20} />
              </IconButton>
            </li>
          )
        })}
      </ul>
      <Button data-testid={`group-add-${kind}`} onClick={onCreate}>
        <Icon name="plus" />
        Novo {one}
      </Button>
    </section>
  )
}

/** Criar, renomear e excluir projetos, categorias e etiquetas (FR-013, FR-014). */
export function ManageGroups() {
  const toast = useToast()
  const [naming, setNaming] = useState<NameState>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  // Quantas tarefas usam cada grupo, de uma vez só.
  const usage =
    useLiveQuery(async () => {
      const m = new Map<string, number>()
      const bump = (k: string) => m.set(k, (m.get(k) ?? 0) + 1)
      await db.tasks.each((t) => {
        if (t.projectId) bump(`project:${t.projectId}`)
        if (t.categoryId) bump(`category:${t.categoryId}`)
        t.tagIds.forEach((id) => bump(`tag:${id}`))
      })
      return m
    }, []) ?? new Map<string, number>()

  async function submitName(name: string) {
    if (!naming) return
    if (naming.group) await renameGroup(naming.kind, naming.group.id, name)
    else await createGroup(naming.kind, name)
    toast.show(naming.group ? 'Nome atualizado' : `${KIND_LABEL[naming.kind].one[0].toUpperCase()}${KIND_LABEL[naming.kind].one.slice(1)} criado`)
    setNaming(null)
  }

  async function askDelete(kind: GroupKind, group: Group) {
    setConfirm({ kind, group, count: await countUsage(kind, group.id) })
  }

  async function doDelete() {
    if (!confirm) return
    const { kind, group } = confirm
    setConfirm(null)
    const { detachedTasks } = await deleteGroup(kind, group.id)
    toast.show(`“${group.name}” excluído`, {
      sub: detachedTasks ? `${detachedTasks} tarefa(s) desassociada(s), nenhuma apagada.` : undefined,
    })
  }

  return (
    <div className="card" data-testid="manage-groups">
      <div className="sec-head">
        <h2>Organizar</h2>
      </div>
      {KINDS.map((kind) => (
        <GroupSection
          key={kind}
          kind={kind}
          usage={usage}
          onCreate={() => setNaming({ kind, group: null })}
          onRename={(group) => setNaming({ kind, group })}
          onDelete={(group) => void askDelete(kind, group)}
        />
      ))}
      <NameDialog
        open={naming !== null}
        title={naming ? `${naming.group ? 'Renomear' : 'Novo'} ${KIND_LABEL[naming.kind].one}` : ''}
        initial={naming?.group?.name ?? ''}
        onSubmit={submitName}
        onCancel={() => setNaming(null)}
      />
      <ConfirmDialog
        open={confirm !== null}
        title={confirm ? `Excluir ${KIND_LABEL[confirm.kind].one}?` : ''}
        message={
          confirm
            ? confirm.count > 0
              ? `“${confirm.group.name}” está em ${confirm.count} tarefa(s). Elas serão mantidas e apenas desassociadas.`
              : `“${confirm.group.name}” não está em nenhuma tarefa.`
            : ''
        }
        onConfirm={() => void doDelete()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
