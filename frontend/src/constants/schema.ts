import * as z from 'zod';

export const MessageSchema = z.object({
  msg: z.string(),
});

export const EntitySchema = z.object({
  id: z.int(),
  name: z.string(),
});

export const EntitiesSchema = z.array(EntitySchema);

export const AuthorStatSchema = z.array(
  z.object({
    author: z.string(),
    count: z.int(),
  }),
);

const TagStructureSchema = z.object({
  tag: z.string(),
  text: z.string(),
});

export const ArticleSchema = z.object({
  id: z.int(),
  title: z.string().trim().min(3, 'Title should have at least 3 characters'),
  author: z.string().trim().min(2, 'Author should have at least 2 characters'),
  url: z.url(' '),
  year: z
    .int('Year must be an integer')
    .min(0, 'Year must be greater than or equal to 0')
    .max(new Date().getFullYear(), 'Year must be less than or equal to the current year'),
  summary: z.string(),
  consulted: z.boolean(),
  read_later: z.boolean(),
  liked: z.boolean(),
  tags: z.array(z.string()),
  date_creation: z.string(),
  date_modification: z.string(),
});

export const ArticleWithContent = ArticleSchema.extend({
  content: z.array(TagStructureSchema).nullable(),
});

export const ArticlesSchema = z.object({
  data: z.array(ArticleSchema),
  total: z.int().min(0),
  offset: z.int().min(0).nullable(),
  limit: z.int().min(0).nullable(),
});

export const ParsedMetadataSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  url: z.string(),
});

const makeDeletedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    deleted: z.array(itemSchema),
    count: z.int(),
  });

export const DeletedArticlesSchema = makeDeletedSchema(ArticleSchema);
export const DeletedEntitiesSchema = makeDeletedSchema(EntitySchema);
