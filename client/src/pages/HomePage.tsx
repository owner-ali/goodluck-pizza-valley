import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import { useTitle } from '../hooks/useTitle'
import Hero from '../sections/Hero'
import Marquee from '../components/Marquee'
import MenuBrowser from '../sections/MenuBrowser'
import IceBar from '../sections/IceBar'
import AboutDeveloper from '../sections/AboutDeveloper'

export default function HomePage({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  useTitle('Good Luck Pizza Valley & Ice Bar | Taste the Happiness. Feel the Chill.', 'Pizza, burgers, pasta and an ice bar of cold mocktails. Order online or reserve a table.')
  return (<>
    <Hero /><Marquee /><MenuBrowser menu={menu} onOpen={onOpen} />
    <div aria-hidden="true" className="relative h-28 overflow-hidden bg-gradient-to-b from-coal to-[#060d14]">
      <div className="wave"><svg viewBox="0 0 2400 60" preserveAspectRatio="none" className="block h-full w-full"><path d="M0 30q150-40 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0V60H0z" fill="#060d14" /></svg></div>
    </div>
    <IceBar menu={menu} onOpen={onOpen} />
    <div aria-hidden="true" className="h-24 bg-gradient-to-b from-[#060d14] to-coal" />
    <AboutDeveloper />
  </>)
}
