import { useEffect, useRef } from 'preact/hooks'

const size = 125

const Wheel = ({ callback, number }) => {
  const el = useRef()

  useEffect(() => {
    if (!el.current || !number) return

    let deg = 0
    let factor = 50
    let start

    const step = timestamp => {
      if (!start) {
        start = timestamp
      }

      const elapsed = timestamp - start

      if (elapsed > 3000) {
        factor = 20
      }

      if (elapsed > 5000) {
        factor = 10
      }

      if (elapsed > 5720) {
        factor = 0
      }

      if (el.current) {
        deg = (deg + (1 * factor)) % 360
        el.current.style.transform = `rotate(${deg}deg)`
      }

      if (factor > 0) {
        window.requestAnimationFrame(step)
      }

      if (factor === 0) {
        el.current.style.transition = 'transform 500ms ease-in-out'
        el.current.style.transform = `rotate(${deg > 180 ? 360 : 0}deg)`
        window.setTimeout(() => callback?.(number), 200)
      }
    }

    window.requestAnimationFrame(step)

    return () => (factor = 0)
  }, [])

  return (
    <div
      className='inline-block rounded-full shadow-lg'
      style={{ height: size + 8, width: size + 8 }}
    >
      <div
        className='border-4 border-rose-100 inline-block relative rounded-full'
        ref={el}
      >
        <div
          className='rounded-full'
          style={{
            background:
              'repeating-conic-gradient(var(--color-primary) 0 25%, var(--color-secondary) 0 50%)',
            height: size,
            width: size
          }}
        />

        <div
          className='absolute flex items-center justify-center text-rose-100 top-0'
          style={{ height: size, width: size }}
        >
          <div
            className='font-semibold text-5xl'
            style={{
              textShadow:
                '3px 3px var(--color-primary), -1px -1px var(--color-primary)'
            }}
          >
            {number}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wheel
