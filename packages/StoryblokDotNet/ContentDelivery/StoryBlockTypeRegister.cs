namespace StoryblokDotNet.ContentDelivery;

public static class StoryBlockTypeRegister
{
    private static IDictionary<string, StoryBlockType>? types;

    public static IDictionary<string, StoryBlockType> Types
    {
        get
        {
            if (types == null)
            {
                var blocks = from a in AppDomain.CurrentDomain.GetAssemblies()
                    from t in a.GetTypes()
                    let attributes = t.GetCustomAttributes(typeof(StoryBlockTypeAttribute), true)
                    where attributes != null && attributes.Length > 0
                    select new { Type = t, Attribute = attributes.Cast<StoryBlockTypeAttribute>().First() };

                var typesRegister = new Dictionary<string, StoryBlockType>();

                foreach (var block in blocks)
                {
                    if (typesRegister.ContainsKey(block.Attribute.Name))
                    {
                        continue;
                    }

                    typesRegister[block.Attribute.Name] = new StoryBlockType
                    {
                        Name = block.Attribute.Name,
                        Type = block.Type,
                        View = block.Attribute.View
                    };
                }

                types = typesRegister;

                return typesRegister;
            }

            return types;
        }
    }
}
