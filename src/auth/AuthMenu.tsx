import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { Card } from '@terra-money/use-station'
import Icon from '../components/Icon'
import { Item } from './Auth'
import s from './AuthMenu.module.scss'

const AuthMenuItem = ({ title, icon, path, disabled }: Omit<Item, 'key'>) => {
  const content = (
    <>
      <Icon name={icon} size={40} />
      <h1>{title}</h1>
      <Icon name="chevron_right" className={s.chevron} />
    </>
  )

  const attrs = { disabled, className: c(s.item), children: content }

  return disabled ? null : false ? (
    <button {...attrs} />
  ) : path ? (
    <Link to={path} {...attrs} />
  ) : null
}

interface Props {
  card?: Card
  list: Item[]
  footer: ReactNode
  onSelect?: (item: Item) => void
}

const AuthMenu = ({ card, list, footer }: Props) => (
  <>
    {card && (
      <header>
        <h1>{card.title}</h1>
        <p>{card.content}</p>
      </header>
    )}

    <div className={s.list}>
      {list.map((item) => (
        <AuthMenuItem {...item} key={item.title} />
      ))}
    </div>
    {footer}
  </>
)

export default AuthMenu
