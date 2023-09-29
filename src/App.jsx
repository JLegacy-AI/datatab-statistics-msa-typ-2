import { lazy } from "react";
import { Suspense } from "react";
import LOADING from "./assets/loading.gif"

const StickyHeader = lazy(() => import("./components/StickyHeader"))
const MSAType2 = lazy(() => import("./pages/msa-type-2"));

function App() {
  return (
    <div className="App font-poppins">
        <Suspense
          fallback={
            <>
              <p className="w-100 min-h-[600px] flex justify-center items-center">
                <img src={LOADING} alt="LOADING IMAGE" height="200" width="200" />
              </p>
            </>
          }
        >
        <StickyHeader />
          <div className="px-20 py-4  mt-[180px] lg:mt-[130px]">
            <MSAType2 />
          </div>
        </Suspense>
    </div>
  );
}

export default App;
