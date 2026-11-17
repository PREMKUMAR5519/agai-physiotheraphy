import './ChatBotMascot.css'

// 252px WebP exports (3x the 84px display size).
const art = `${import.meta.env.BASE_URL}images/bot`

export default function ChatBotMascot() {
  return <><div className="chat-bot-stage" aria-hidden="true">
    <div className="chat-bot-travel"><div className="chat-bot-pose">
      <img
        className="chat-bot-art chat-bot-idle"
        src={`${art}/idle.webp`}
        alt=""
        width="84"
        height="84"
        draggable={false}
      />
      <div className="chat-bot-turn"><div className="chat-bot-direction"><img className="chat-bot-art" src={`${art}/turn.webp`} alt="" width="84" height="84" draggable={false} /></div></div>
      <div className="chat-bot-walk"><div className="chat-bot-direction"><div className="chat-bot-stride">
        {[1, 2, 3, 4].map(frame => <img
          key={frame}
          className={`chat-bot-art chat-bot-frame chat-bot-frame-${frame}`}
          src={`${art}/walk-${frame}.webp`}
          alt=""
          width="84"
          height="84"
          draggable={false}
        />)}
      </div></div></div>
    </div></div>
  </div><img className="chat-bot-hands" src={`${art}/hands.webp`} alt="" aria-hidden="true" width="72" height="12" draggable={false} /></>
}
