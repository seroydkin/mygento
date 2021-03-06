import React from 'react'

import { ServerStyleSheets } from '@material-ui/core/styles'
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import sprite from 'svg-sprite-loader/runtime/sprite.build'

type TProps = DocumentProps & {
  spriteContent: string
}

class MyDocument extends Document<TProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage
    const sheets = new ServerStyleSheets({ injectFirst: true })

    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: App => props => sheets.collect(<App {...props} />),
        // useful for wrapping in a per-page basis
        enhanceComponent: Component => Component,
      })

    const initialProps = await Document.getInitialProps(ctx)
    const spriteContent = sprite.stringify() as string

    return {
      ...initialProps,
      spriteContent,
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    }
  }

  render() {
    const { spriteContent } = this.props

    return (
      <Html>
        <Head />
        <body>
          <div
            style={{ display: 'none' }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: spriteContent,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
