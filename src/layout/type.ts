interface MenuItem {
  title: string
  link: string
  routeName: string
  key: string
}
interface Menu {
  [key: string]: MenuItem
}
