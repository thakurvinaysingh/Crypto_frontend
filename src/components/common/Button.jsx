export default function Button({ as:Comp='button', className='', ...props }) {
  return <Comp className={`button-primary ${className}`} {...props} />
}
