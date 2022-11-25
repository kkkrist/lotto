const Input = ({ hasError, highlight, ...props }) => {
  if (props.type === 'range') {
    return (
      <input
        className='m-2 shadow-lg'
        {...props}
      />
    )
  }

  let className =
    'block border-2 border-indigo-500 px-2 py-1 rounded shadow-lg w-full disabled:bg-white'

  if (hasError) {
    className += ' border-red-500'
  }

  if (!hasError && highlight) {
    className += ' bg-rose-100'
  }

  return (
    <input
      className={className}
      {...props}
    />
  )
}

export default Input
