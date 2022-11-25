const Button = ({ isPrimary, ...props }) => (
  <button
    className={`${
      isPrimary ? 'bg-rose-100' : ''
    } border-2 border-indigo-500 disabled:opacity-75 m-2 px-2 py-1 rounded shadow-lg`}
    {...props}
  />
)

export default Button
