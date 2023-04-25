// If no filter string is provided, then the where object will be just an empty object and no filtering conditions will be applied by Prisma Client when it returns the response for the links query.

// In cases where there is a filter carried by the incoming args, you’re constructing a where object that expresses our two filter conditions from above. This where argument is used by Prisma to filter out those Link elements that don’t adhere to the specified conditions.

// In this case, two where conditions are specified: A link is only returned if either its url contains the provided filter or its description contains the provided filter. Both conditions are combined using Prisma’s OR operator.
async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } }
        ]
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy
  });

  const count = await context.prisma.link.count({ where });

  return {
    id: 'main-feed',
    links,
    count
  };
}

module.exports = {
  feed
};
