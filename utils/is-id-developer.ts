import { includes, split } from "lodash";

export default (id: string) => includes(split(process.env.DEVELOPERS, ","), id);
