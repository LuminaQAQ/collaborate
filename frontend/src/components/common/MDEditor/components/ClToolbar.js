import { CommentIconTemplate } from '../assets/imgs/CommentIcon'
import { ReadingAssistantIconTemplate } from '../assets/imgs/ReadingAssistantIcon'

const toolItems = [
  { name: 'comment', template: CommentIconTemplate },
  { name: 'reading-assistant', template: ReadingAssistantIconTemplate },
]

export default class ClToolbar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        --toolbar-left: 0;
        --toolbar-top: 0;
        --toolbar-visibility: hidden;

        position: absolute;
        left: var(--toolbar-left);
        top: var(--toolbar-top);
        visibility: var(--toolbar-visibility);
      }
      .toolbar-container {
        display: flex;
        padding: .25rem;
        border-radius: .5rem;
        transform: translateY(-100%);
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        z-index: 100;
      }
      .toolbar-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .25rem;
        margin: .25rem;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      .toolbar-item:hover {
        background-color: #e5e5e5;
      }
    </style>
    <div class="toolbar-container">
      ${toolItems
        .map((item) => {
          return `
          <div class="toolbar-item ${item.name}">
            ${item.template}
          </div>
        `
        })
        .join('')}
    </div>
    `

    this.commentIcon = this.shadowRoot.querySelector('.comment')
    this.readingAssistantIcon = this.shadowRoot.querySelector('.reading-assistant')
  }

  connectedCallback() {
    this.render()
  }
}

if (!customElements.get('cl-toolbar')) {
  customElements.define('cl-toolbar', ClToolbar)
}
