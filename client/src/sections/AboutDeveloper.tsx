import CodedByAliLogo from '../components/CodedByAliLogo'
export default function AboutDeveloper() {
  return (
    <section id="developer" className="px-6 py-20">
      <div className="glass mx-auto flex max-w-3xl flex-col items-center gap-4 p-8 text-center">
        <CodedByAliLogo size={56} />
        <h2 className="text-3xl font-bold">Designed &amp; Developed by CodedByAli</h2>
        <p className="max-w-lg muted">This website is built with free and open-source tools: React, Three.js, Node.js and MongoDB. The restaurant's brand always comes first; this is just the developer's signature.</p>
        <a className="btn btn-frost" href="https://codedbyali.site.je/" target="_blank" rel="noopener noreferrer">Visit codedbyali.site.je</a>
      </div>
    </section>
  )
}
