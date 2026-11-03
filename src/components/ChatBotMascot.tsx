import './ChatBotMascot.css'

export default function ChatBotMascot() {
  return <><div className="chat-bot-stage" aria-hidden="true">
    <div className="chat-bot-travel"><div className="chat-bot-pose">
      <img
        className="chat-bot-art chat-bot-idle"
        src="/images/bot/Blue%20lightning%20chibi%20avatar.png"
        alt=""
        width="84"
        height="84"
        draggable={false}
      />
      <div className="chat-bot-turn"><div className="chat-bot-direction"><img className="chat-bot-art" src="/images/bot/Blue%20Chibi%20Avatar%20Turning%20Right.png" alt="" width="84" height="84" draggable={false} /></div></div>
      <div className="chat-bot-walk"><div className="chat-bot-direction"><div className="chat-bot-stride">
        {[1, 2, 3, 4].map(frame => <img
          key={frame}
          className={`chat-bot-art chat-bot-frame chat-bot-frame-${frame}`}
          src={`/images/bot/Blue%20Chibi%20Avatar%20Walking%20Right-frame${frame}.png`}
          alt=""
          width="84"
          height="84"
          draggable={false}
        />)}
      </div></div></div>
    </div></div>
  </div><img className="chat-bot-hands" src="/images/bot/hide-nd-seeing.png" alt="" aria-hidden="true" width="72" height="12" draggable={false} /></>
}
