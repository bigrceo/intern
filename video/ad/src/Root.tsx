import { Composition } from "remotion";
import { HowItWorks } from "./HowItWorks";
export const Root = () => <Composition id="HowItWorks" component={HowItWorks} durationInFrames={900} fps={60} width={1080} height={1080} defaultProps={{ ticker: "PLAYLIST" }} />;
