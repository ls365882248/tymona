// todo react
const React: any = {}
export {};

const Didact = {
  createElement,
}

/** @tsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
// const element = React.createElement({
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello"
//   }
// })

function createElement(type: string, props: any, children: any) {
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}