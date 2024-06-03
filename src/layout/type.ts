interface MenuItem {
  [key: string]: string
}
interface Menu {
  [key: string | symbol]: MenuItem
}
