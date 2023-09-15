import StickyHeader from "./components/StickyHeader";
import MSAType2 from "./pages/msa-type-2";

function App() {
  return (
    <div className="App font-poppins">
      <StickyHeader />
      <div className="px-20 py-4  mt-[130px]">
        <MSAType2 />
      </div>
    </div>
  );
}

export default App;
