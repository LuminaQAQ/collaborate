import { CommentIconTemplate } from '../assets/imgs/CommentIcon'

export default class ClCommentButton extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .comment-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #f5f5f5;
          color: #333;
          cursor: pointer;
        }
      </style>
      <div class="comment-btn">
        ${CommentIconTemplate}
      </div>
    `
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    this.remove()
  }
}

if (!window.customElements.get('cl-comment-btn')) {
  window.customElements.define('cl-comment-btn', ClCommentButton)
}
