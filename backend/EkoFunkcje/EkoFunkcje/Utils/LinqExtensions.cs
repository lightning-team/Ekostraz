using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace EkoFunkcje.Utils
{
    public static class LinqExtenssions
    {
        private static readonly MethodInfo OrderByMethod =
            typeof(Queryable).GetMethods()
                .Where(method => method.Name == "OrderBy").Single(method => method.GetParameters().Length == 2);

        private static readonly MethodInfo OrderByDescendingMethod =
            typeof(Queryable).GetMethods()
                .Where(method => method.Name == "OrderByDescending").Single(method => method.GetParameters().Length == 2);

        private static IList<TSource> DoOrderBy<TSource>(IList<TSource> source, string propertyName, MethodInfo orderMethod)
        {
            ParameterExpression parameter = Expression.Parameter(typeof(TSource), "p");
            Expression orderByProperty = Expression.Property(parameter, propertyName);

            LambdaExpression lambda = Expression.Lambda(orderByProperty, new[] { parameter });

            MethodInfo genericMethod = orderMethod.MakeGenericMethod
                (new[] { typeof(TSource), orderByProperty.Type });
            object ret = genericMethod.Invoke(null, new object[] { source, lambda });
            return (IList<TSource>)ret;
        }

        public static IList<TSource> OrderBy<TSource>
            (this IList<TSource> source, string propertyName)
        {
            return DoOrderBy(source, propertyName, OrderByMethod);
        }

        public static IList<TSource> OrderByDescending<TSource>
            (this IList<TSource> source, string propertyName)
        {
            return DoOrderBy(source, propertyName, OrderByDescendingMethod);
        }
    }
}
