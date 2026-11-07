import type { ReactNode } from 'react'
import type { Tool } from '../types'
import { useT } from '../i18n'

type Row = { label: string; cell: (t: Tool) => ReactNode }
const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>
)

export default function CompareTable({ tools, onChoose }: { tools: Tool[]; onChoose: (t: Tool) => void }) {
  const { t } = useT()
  const yn = (b: boolean) => (b ? t('compare.yes') : t('compare.no'))
  const rows: Row[] = [
    { label: t('compare.row.score'), cell: (x) => `${x.overallScore} / 100` },
    { label: t('compare.row.price'), cell: (x) => x.pricing.startingPrice },
    { label: t('compare.row.free'), cell: (x) => yn(x.pricing.freeTier) },
    { label: t('compare.row.setup'), cell: (x) => `~${x.setupMinutes} min` },
    { label: t('compare.row.features'), cell: (x) => <List items={x.features ?? []} /> },
    { label: t('compare.row.integrations'), cell: (x) => x.worksWith.join(', ') },
    { label: t('compare.row.pros'), cell: (x) => <List items={x.pros} /> },
    { label: t('compare.row.cons'), cell: (x) => <List items={x.cons} /> },
  ]
  return (
    <>
      {/* Wide screens: a real table with row and column headers. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{t('compare.caption')}</caption>
          <thead>
            <tr>
              <td className="p-3" />
              {tools.map((x) => <th key={x.id} scope="col" className="border-b-2 border-accent p-3 text-xl">{x.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line align-top">
                <th scope="row" className="w-40 p-3 font-bold">{r.label}</th>
                {tools.map((x) => <td key={x.id} className="p-3">{r.cell(x)}</td>)}
              </tr>
            ))}
            <tr>
              <td />
              {tools.map((x) => (
                <td key={x.id} className="p-3">
                  <button type="button" className="btn-primary" onClick={() => onChoose(x)}>{t('card.choose')}<span className="sr-only">: {x.name}</span></button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phones: one stacked card per tool. */}
      <div className="space-y-4 md:hidden">
        {tools.map((x) => (
          <section key={x.id} aria-labelledby={`cmp-${x.id}`} className="rounded-xl border border-line p-4">
            <h3 id={`cmp-${x.id}`} className="mb-3 text-xl">{x.name}</h3>
            <dl className="space-y-3">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="font-bold">{r.label}</dt>
                  <dd>{r.cell(x)}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className="btn-primary mt-4 w-full" onClick={() => onChoose(x)}>{t('card.choose')}<span className="sr-only">: {x.name}</span></button>
          </section>
        ))}
      </div>
    </>
  )
}
