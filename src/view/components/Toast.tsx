import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { match as indicator_match } from '#/model/indicator'
import { state } from '#/init'
import { identity } from '#/lib/utils'
import { useSubscribe } from '#/view/useSubscribe'


type ToastConfig = {
  auto_hide_delay_ms?: number
}

export const Toaster = (
  props: ToastConfig,
) => createPortal(Toast(props), document.body)


const Toast = (props: ToastConfig) => {
  const indicator_err = indicator_match({
    idle: null,
    delaying: null,
    loading: null,
    error: identity<string>,
  })(useSubscribe(state.fetch_indicator))

  const err_prev = useRef<string | null>(null)
  const [err, set_err] = useState('')
  const [is_show, set_show] = useState(false)
  if (indicator_err !== null && indicator_err !== err_prev.current) {
    set_err(indicator_err)
    set_show(true)
    err_prev.current = indicator_err
  }

  useEffect(() => {
    if (props.auto_hide_delay_ms || 0 > 0) {
      const tid = setTimeout(set_show, props.auto_hide_delay_ms, false)
      return () => clearTimeout(tid)
    }
  }, [set_show, err, props.auto_hide_delay_ms])

  return (
    <div
      className=":uno: position-fixed bottom-5 pos-right-50% translate-x-50% duration-300"
      style={{ opacity: +is_show }}
    >
      <ToastCard err={err} close={() => set_show(false)} />
    </div>
  )
}

const ToastCard = ({ err, close }: { err: string, close: () => void }) => (
  <div
    className={String.raw`:uno:
      flex items-center w-full max-w-xs p-4 m-auto
    text-gray-500 bg-white rounded-lg shadow-sm
    dark:text-gray-400 dark:bg-gray-800
    `}
    role="alert"
  >
    <div
      className={String.raw`:uno:
        inline-flex items-center justify-center shrink-0 w-8 h-8
      text-orange-500 bg-orange-100 rounded-lg
      dark:bg-orange-700 dark:text-orange-200
      `}
    >
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1
                 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
        />
      </svg>
      <span className="sr-only">Warning icon</span>
    </div>
    <div className=":uno: wrap-anywhere ms-3 text-sm font-normal">{err}</div>
    <button
      type="button"
      className={String.raw`:uno:
        ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900
        rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100
        inline-flex items-center justify-center h-8 w-8
        dark:text-gray-500 dark:hover:text-white
        dark:bg-gray-800 dark:hover:bg-gray-700
      `}
      data-dismiss-target="#toast-warning"
      aria-label="Close"
      onClick={close}
    >
      <span className="sr-only">Close</span>
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>
)
