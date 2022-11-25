import { useEffect, useState } from 'preact/hooks'
import Button from './button'
import Input from './input'
import Label from './label'
import Wheel from './wheel'

const getRandomNumber = (x, y, precision = 0) =>
  precision
    ? +(Math.random() * (y - x + 1) + x).toFixed(precision)
    : Math.floor(Math.random() * (y - x + 1) + x)

const App = () => {
  const [drawn, setDrawn] = useState([])
  const [numWheels, setNumWheels] = useState(6)
  const [numbers, setNumbers] = useState([])
  const [players, setPlayers] = useState([])

  const addNumber = e =>
    e.code === 'Space' && e.target?.localName !== 'input' &&
    setNumbers(prevState => {
      if (prevState.length === numWheels) return prevState

      let nextNumber = getRandomNumber(1, 49)
      while (prevState.includes(nextNumber)) {
        nextNumber = getRandomNumber(1, 49)
      }

      return [...prevState, nextNumber]
    })

  const addPlayer = () =>
    setPlayers(prevState => [
      ...prevState,
      { name: '', numbers: [], _id: Math.random() }
    ])

  const clearPlayer = id =>
    () =>
      setPlayers(prevState => {
        const nextState = [...prevState]
        const i = nextState.findIndex(p => p._id === id)
        nextState[i].numbers = []
        return nextState
      })

  const fillRandom = id =>
    () =>
      setPlayers(prevState => {
        const nextState = [...prevState]
        const i = nextState.findIndex(p => p._id === id)

        for (let j = 0; j < numWheels; j++) {
          if (!nextState[i].numbers[j]) {
            nextState[i].numbers[j] = null
          }
        }

        const missingIndexes = nextState[i].numbers.reduce(
          (acc, num, index) => {
            if (!num) acc.push(index)
            return acc
          },
          []
        )

        missingIndexes.forEach(idx => {
          let num = getRandomNumber(1, 49)
          while (nextState[i].numbers.includes(num)) {
            num = getRandomNumber(1, 49)
          }
          nextState[i].numbers[idx] = num
        })

        return nextState
      })

  const handlePlayerName = id =>
    e =>
      setPlayers(prevState => {
        const nextState = [...prevState]
        const i = nextState.findIndex(p => p._id === id)
        nextState[i].name = e.target.value
        return nextState
      })

  const handlePlayerNumber = (id, num) =>
    e =>
      setPlayers(prevState => {
        const nextState = [...prevState]
        const i = nextState.findIndex(p => p._id === id)
        const val = Number(e.target.value)
        nextState[i].numbers[num] = val
        return nextState
      })

  const handleReset = () => {
    setNumbers([])
    setDrawn([])
  }

  const removePlayer = id =>
    () => setPlayers(prevState => prevState.filter(p => p._id !== id))

  useEffect(() => {
    window.addEventListener('keydown', addNumber)
    return () => window.removeEventListener('keydown', addNumber)
  }, [])

  return (
    <div className='font-mono px-6 py-4 text-indigo-700'>
      <h1 className='font-bold pb-2 text-3xl'>Johnnys Lottomaschine</h1>

      <p className='pb-4 text-xl'>
        Lotto {numWheels} aus 49
      </p>

      <div className='flex overflow-x-auto -m-2 pb-4'>
        {numbers.map(num => (
          <div className='m-2'>
            <Wheel
              callback={num => setDrawn(prevState => [...prevState, num])}
              key={num}
              number={num}
            />
          </div>
        ))}

        {new Array(numWheels - numbers.length).fill(1).map(() => (
          <div
            className='m-2'
            onClick={() => addNumber({ code: 'Space' })}
          >
            <Wheel key={Math.random()} />
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-center pb-6 -m-2'>
        <Input
          disabled={numbers.length > 0}
          max={8}
          min={1}
          onInput={({ target: { value } }) => setNumWheels(Number(value))}
          step={1}
          type='range'
          value={numWheels}
        />

        <Button
          disabled={drawn.length > 0}
          onClick={addPlayer}
        >
          Spielschein (+)
        </Button>

        <Button
          onClick={handleReset}
        >
          Noch mal!
        </Button>

        <Button
          disabled={numbers.length === numWheels}
          isPrimary
          onClick={() => addNumber({ code: 'Space' })}
        >
          Nummer ziehen!
        </Button>
      </div>

      <div className='flex flex-wrap -m-2'>
        {players.map(player => (
          <div className='md:w-2/3 lg:w-1/2 w-full' key={player._id}>
            <div className='bg-indigo-100 m-2 p-4 rounded shadow-lg'>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='text-xl'>
                  Spielschein
                </h2>

                <div className='-m-1'>
                  <button
                    className='m-1'
                    disabled={drawn.length > 0}
                    onClick={clearPlayer(player._id)}
                  >
                    (x)
                  </button>

                  <button
                    className='m-1'
                    disabled={player.numbers.filter(a =>
                          a
                        ).length === numWheels || drawn.length > 0}
                    onClick={fillRandom(player._id)}
                  >
                    (#)
                  </button>

                  <button className='m-1' onClick={removePlayer(player._id)}>
                    (-)
                  </button>
                </div>
              </div>

              <Label>
                Name
                <Input
                  name='name'
                  onInput={handlePlayerName(player._id)}
                  value={player.name}
                />
              </Label>

              <div className='flex justify-between pt-2 -m-1'>
                {new Array(numWheels).fill(1).map((_, i) => {
                  const num = player.numbers[i] || ''
                  return (
                    <div className='m-1' key={i}>
                      <Label>
                        {i + 1}
                        <Input
                          disabled={drawn.length > 0}
                          hasError={isNaN(num) || !(num >= 1 && num <= 49) ||
                            player.numbers.filter(n => n === num).length > 1}
                          highlight={drawn.includes(num)}
                          max='49'
                          min='1'
                          onInput={handlePlayerNumber(player._id, i)}
                          type='number'
                          value={num}
                        />
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
