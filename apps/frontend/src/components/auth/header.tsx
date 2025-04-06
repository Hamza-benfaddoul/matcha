interface HeaderProps {
  label: string
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-y-4'>
      <h1 className="text-3xl inline font-semibold ">
        <span className="inline bg-gradient-to-r from-[#f9cfcf]  to-[#f87171] text-transparent bg-clip-text">
          Matcha
        </span>{" "}
      </h1>
      <p className='text-sm text-muted-foreground'> {label}</p>

    </div>
  )
}

export default Header
