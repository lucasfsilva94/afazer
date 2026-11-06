#!/usr/bin/env bash
# Uso: .claude/move-issues.sh <status> <numero-da-issue>...   (status: backlog|ready|progress|review|done)
set -e
P=PVT_kwHOAVFWks4BqaMB; F=PVTSSF_lAHOAVFWks4BqaMBzhoxc9Y
case $1 in backlog) O=f75ad846;; ready) O=61e4505c;; progress) O=47fc9ee4;; review) O=df73e18b;; done) O=98236657;; *) echo status invalido; exit 1;; esac
shift
gh project item-list 1 --owner @me --limit 300 --format json > .claude/.items.json
for n in "$@"; do
  id=$(node -e "const j=JSON.parse(require('fs').readFileSync('.claude/.items.json'));const i=j.items.find(i=>i.content.number==$n);console.log(i?i.id:'')")
  [ -n "$id" ] && gh project item-edit --project-id $P --id $id --field-id $F --single-select-option-id $O >/dev/null && echo "#$n ok" || echo "#$n nao encontrada"
done
rm -f .claude/.items.json
