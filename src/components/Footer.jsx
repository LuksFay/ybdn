const Footer = () => {
  return (
    <footer className="mt-20 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
      <p>
        Hecho por{' '}
        <a
          href="https://x.com/LuksFaydev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 hover:text-red-300 underline underline-offset-2"
        >
          @LuksFayDev
        </a>
        {' '}&middot;{' '}
        <a
          href="https://github.com/LuksFay/ybdn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 underline underline-offset-2"
        >
          GitHub
        </a>
      </p>
    </footer>
  )
}

export default Footer
