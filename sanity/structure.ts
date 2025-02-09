import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Constellation of Thoughts')
    .items([
      S.documentTypeListItem('constellationThought').title('Constellation Thought'),

      S.documentTypeListItem('constellationGroup').title('Constellation Group'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['constellationThought',  'constellationGroup'].includes(item.getId()!),
      ),
    ])
