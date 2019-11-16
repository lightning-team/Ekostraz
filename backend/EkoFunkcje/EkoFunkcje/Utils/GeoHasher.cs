using System;
using System.Collections.Generic;
using System.Text;
using NGeoHash;

namespace EkoFunkcje.Utils
{
    public static class GeoHasher
    {
        public static string GetGeoHash(string latitude, string longitude)
        {
            var latitudeParsed = double.Parse(latitude.Replace(".", ","));
            var longitudeParsed = double.Parse(longitude.Replace(".", ","));
            var geoHash = GeoHash.Encode(latitudeParsed, longitudeParsed, Config.GeoHashPrecision);
            return geoHash;
        }
    }
}
