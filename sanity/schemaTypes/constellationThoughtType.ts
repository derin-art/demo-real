import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const constellationThoughtType = defineType({
  name: 'constellationThought',
  title: 'Constellation Thought',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),

    defineField({
      name: "date_made",
      type: "date",
      title: "date made",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'constellation_group',
      type: 'reference',
      to: {type: 'constellationGroup'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      
      media: 'mainImage',
    },
    prepare(selection) {
    
      return {...selection}
    },
  },
})
