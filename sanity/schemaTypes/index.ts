import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {constellationThoughtType} from './constellationThoughtType'
import {constellationGroupType} from "./constellationGroupType"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType,  constellationThoughtType, constellationGroupType],
}
