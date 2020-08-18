import React from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import Icon from '../components/Icon'
import { Item } from './Auth'
import s from './AuthMenu.module.scss'

interface Props {
  list: Item[]
  onSelect?: (item: Item) => void
}

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

const AuthMenu = ({ list }: Props) => (
  <div className={s.list}>
    {list.map((item) => (
      <AuthMenuItem {...item} key={item.title} />
    ))}
  </div>
)

export default AuthMenu
