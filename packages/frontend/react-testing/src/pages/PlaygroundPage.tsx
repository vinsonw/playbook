/* eslint-disable @typescript-eslint/no-unused-vars */
import Onboarding from "../components/Onboarding"
import ExpandableText from "../components/ExpandableText"
import SearchBox from "../components/SearchBox"
import TagList from "../components/TagList"
import OrderStatusSelector from "../components/OrderStatusSelector"

const PlaygroundPage = () => {
  // return <Onboarding />;
  // return <ExpandableText text={"hi".repeat(255)} />
  // return (
  //   <SearchBox
  //     onChange={(text) => {
  //       console.log(text)
  //     }}
  //   />
  // )
  // return <TagList />
  return <OrderStatusSelector onChange={console.log} />
}

export default PlaygroundPage
