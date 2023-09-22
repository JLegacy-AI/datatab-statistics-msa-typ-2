import { lazy } from "react";
import StickyHeader from "./components/StickyHeader";
import { Suspense } from "react";

const MSAType2 = lazy(() => import("./pages/msa-type-2"));

function App() {
  return (
    <div className="App font-poppins">
      <StickyHeader />
      <div className="px-20 py-4  mt-[130px]">
        <Suspense
          fallback={
            <>
              <p className="w-100 min-h-[600px] flex justify-center items-center">
                Loading...
              </p>
            </>
          }
        >
          <MSAType2 />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
