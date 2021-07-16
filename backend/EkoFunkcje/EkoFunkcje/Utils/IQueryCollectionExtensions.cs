using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

///<Summary>
/// Adapted to C# 7.x from <see href="https://khalidabuhakmeh.com/read-and-convert-querycollection-values-in-aspnet">this article</see>
///</Summary>
namespace EkoFunkcje.Utils.Query
{
    public static class IQueryCollectionExtensions
    {
        public static List<T> All<T>(
            this IQueryCollection collection,
            string key)
        {
            var values = new List<T>();

            if (collection.TryGetValue(key, out var results))
            {
                foreach (var val in results)
                {
                    try
                    {
                        var result = typeof(T).IsEnum ? (T)Enum.Parse(typeof(T), val) : (T)Convert.ChangeType(val, typeof(T));
                        values.Add(result);
                    }
                    catch (Exception)
                    {
                        // conversion failed
                        // skip value
                    }
                }
            }

            // return an array with at least one
            return values;
        }

        public static T Get<T>(
            this IQueryCollection collection,
            string key,
            T defaultValue,
            ParameterPick option = ParameterPick.First)
        {
            var values = All<T>(collection, key);
            var value = defaultValue;

            if (values.Any())
            {
                if (option == ParameterPick.First)
                {
                    value = values.FirstOrDefault();
                }
                else if (option == ParameterPick.Last)
                {
                    value = values.LastOrDefault();
                }
            }

            return value;
        }
    }

    public enum ParameterPick
    {
        First,
        Last
    }
}