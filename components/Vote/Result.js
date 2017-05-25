import React from 'react'
import {sum} from 'd3-array'
import {css} from 'glamor'

import {
  Interaction, Label, A
} from '@project-r/styleguide'

import {countFormat} from '../../lib/utils/formats'

import CantonMap from './CantonMap'
import BarChart from './BarChart'
import colors from './colors'

const {H2, H3, P} = Interaction

const styles = {
  legend: css({
    marginTop: 20,
    marginBottom: 20
  }),
  legendBadges: css({
    lineHeight: '20px',
    '& > *': {
      marginBottom: 5,
      marginRight: 5
    }
  }),
  badge: css({
    display: 'inline-block',
    verticalAlign: 'bottom',
    padding: '1px 6px',
    borderRadius: 4,
    color: '#fff'
  })
}

const randomResult = (key, options, total) => {
  let remaining = 1

  const optionsTotal = sum(options, o => o.count)

  const optionResults = options.map((option, i) => {
    const part = i === options.length - 1
      ? remaining
      : (
        i === 0
        ? option.count / optionsTotal * Math.min(Math.random() + 0.5, 1)
        : Math.random() * remaining
      )
    remaining -= part
    return {
      count: Math.max(Math.max(1, total * 0.05), total * part),
      name: option.name
    }
  })

  return {
    key,
    count: sum(optionResults, o => o.count),
    options: optionResults
  }
}

export default ({name, data, t}) => {
  const winner = data.options.find(o => o.winner)
  const totalVotes = sum(data.options, o => o.count)

  const bars = [
    {
      key: 'Total',
      count: totalVotes,
      options: data.options
    }
  ]

  const cantonResult = [
    ['ZH', 'Kanton Zürich', 0.35 * totalVotes],
    ['BE', 'Kanton Bern', 0.1 * totalVotes],
    ['SG', 'Kanton St. Gallen', 0.05 * totalVotes],
    ['LU', 'Kanton Luzern', 0.05 * totalVotes],
    ['AG', 'Kanton Aargau', 0.05 * totalVotes],
    ['BS', 'Kanton Basel-Stadt', 0.019 * totalVotes],
    ['SO', 'Kanton Solothurn', 0.019 * totalVotes],
    ['ZG', 'Kanton Zug', 0.019 * totalVotes],
    ['GR', 'Kanton Graubünden', 0.019 * totalVotes],
    ['SH', 'Kanton Schaffhausen', 0.019 * totalVotes],
    ['TG', 'Kanton Thurgau', 0.019 * totalVotes],
    ['FR', 'Canton de Fribourg', 0.019 * totalVotes],
    ['BL', 'Kanton Basel-Landschaft', 0.019 * totalVotes],
    ['UR', 'Kanton Uri', 0.019 * totalVotes],
    ['AR', 'Kanton Appenzell Ausserrhoden', 0.019 * totalVotes],
    ['SZ', 'Kanton Schwyz', 0.019 * totalVotes],
    ['VD', 'Canton de Vaud', 0.019 * totalVotes],
    ['NW', 'Kanton Nidwalden', 0.019 * totalVotes],
    ['GE', 'Canton de Genève', 0.019 * totalVotes],
    ['VS', 'Canton du Valais', 0.019 * totalVotes],
    ['GL', 'Kanton Glarus', 0.019 * totalVotes],
    ['OW', 'Kanton Obwalden', 0.019 * totalVotes],
    ['TI', 'Cantone Ticino', 0.019 * totalVotes],
    ['NE', 'Canton de Neuchâtel', 0.019 * totalVotes],
    ['JU', 'Canton du Jura', 0.019 * totalVotes],
    ['AI', 'Kanton Appenzell Innerrhoden', 0.019 * totalVotes]
  ].map(([key, _, total]) => (
    randomResult(key, data.options, total)
  ))

  return (
    <div>
      <H2>Resultat</H2>

      <P>
        Gewonnen hat
        {' '}
        <span {...styles.badge} style={{
          backgroundColor: colors[winner.name]
        }}>
          {t(`vote/${name}/options/${winner.name}/title`)}
        </span>
        {' '}
        mit {countFormat(winner.count)} Stimmen – rund {Math.round(winner.count / totalVotes * 1000) / 10} Prozent der Stimmen.
      </P>

      <br />
      <BarChart data={bars} />

      <div {...styles.legend}>
        <Label>Legende</Label>
        <div {...styles.legendBadges}>
          {data.options.map(option => (
            <span key={option.name} {...styles.badge} style={{
              backgroundColor: colors[option.name]
            }}>
              {t(`vote/${name}/options/${option.name}/title`)}
            </span>
          ))}
        </div>
      </div>

      <H3>Nach Land</H3>
      <BarChart compact data={[
        ['Schweiz', totalVotes * 0.94],
        ['Deutschland', totalVotes * 0.03],
        ['Österreich', totalVotes * 0.01],
        ['Lichtenstein', totalVotes * 0.009],
        ['Übrige', totalVotes * 0.011]
      ].map(([key, total]) => (
        randomResult(key, data.options, total)
      ))} />
      <br />
      <Label>Geometrische Grundlage: <A href='http://www.geonames.org/countries/' target='_blank'>geonames.org</A></Label>

      <br />
      <br />
      <br />

      <H3>Nach Kanton</H3>
      <br />
      {data.options.map(o => o.name).map(option => (
        <div>
          <span {...styles.badge} style={{
            backgroundColor: colors[option]
          }}>
            {t(`vote/${name}/options/${option}/title`)}
          </span>
          <CantonMap
            data={cantonResult}
            fill={colors[option]}
            fillOpacity={d => (
              d.options.find(o => o.name === option).count / d.count
            )} />
          <br />
          <br />
        </div>
      ))}
      <br />
      <Label>Geometrische Grundlage: <A href='https://shop.swisstopo.admin.ch/de/products/landscape/boundaries3D' target='_blank'>swisstopo</A></Label>

      <br />
      <br />
      <br />

      <H3>Schweiz: Stadt vs. Land?</H3>
      <BarChart compact data={[
        ['Stätisch', totalVotes * 0.8],
        ['Intermediär', totalVotes * 0.15],
        ['Ländlich', totalVotes * 0.05]
      ].map(([key, total]) => (
        randomResult(key, data.options, total)
      ))} />
      <br />
      <Label>Geometrische Grundlage: <A href='https://www.bfs.admin.ch/bfs/de/home/statistiken/querschnittsthemen/raeumliche-analysen.gnpdetail.2017-0593.html'>BFS</A>, <A href='https://www.cadastre.ch/de/services/service/plz.html' target='_blank'>swisstopo</A></Label>

      <br />
      <br />
      <br />

      <H3>Nach Altersgruppen</H3>
      <BarChart compact data={data.stats.ages} />
    </div>
  )
}
