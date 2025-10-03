import type {
  InputEventHandler,
  InputHTMLAttributes,
  KeyboardEventHandler,
} from 'react'
import { present, state } from '#/init'
import { QueryFlags } from '#/model/model'
import { useSubscribe } from '#/view/useSubscribe'


type InputHTMLAttributesWithoutHandles = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onKeyUp' | 'onKeyDown' | 'onInput' | 'onChange'
>

const onKeyUp: KeyboardEventHandler<HTMLInputElement> = event => {
  if (event.nativeEvent.key === 'Enter') return present.query()
  present.input(event.currentTarget.value, QueryFlags.CHANGE)
}

const onInput: InputEventHandler<HTMLInputElement> = event => {
  const nativeEvent = event.nativeEvent
  let flags = 0b00
  if (['insertFromPaste', 'deleteByCut'].includes(nativeEvent.inputType))
    flags = QueryFlags.CHANGE | QueryFlags.ENTER
  else if (!nativeEvent.inputType) flags = QueryFlags.CHANGE
  present.input(event.currentTarget.value, flags)
}

export const QueryInput = (props: InputHTMLAttributesWithoutHandles) => (
  <input
    {...props}
    onKeyUp={onKeyUp}
    onInput={onInput}
    value={useSubscribe(state.input)}
  />
)
