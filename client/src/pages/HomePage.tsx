import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import { useTitle } from '../hooks/useTitle'
import Hero from '../sections/Hero'
import MenuBrowser from '../sections/MenuBrowser'
import IceBar from '../sections/IceBar'
import AboutDeveloper from '../sections/AboutDeveloper'

export default function HomePage({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  useTitle('Good Luck Pizza Valley & Ice Bar | Taste the Happiness. Feel the Chill.', 'Pizza, burgers, pasta and an ice bar of cold mocktails. Order online or reserve a table.')
  return (<>
    <Hero /><MenuBrowser menu={menu} onOpen={onOpen} />
    <div aria-hidden="true" className="h-32 bg-gradient-to-b from-coal to-[#06161c]" />
    <IceBar menu={menu} onOpen={onOpen} />
    <div aria-hidden="true" className="h-24 bg-gradient-to-b from-[#06161c] to-coal" />
    <AboutDeveloper />
  </>)
}
