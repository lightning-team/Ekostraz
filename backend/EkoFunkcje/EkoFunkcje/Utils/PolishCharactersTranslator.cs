using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Utils
{
    public interface IStringTranslator
    {
        string TranslatePolishCharsInString(string dirtyString);
    }

    public class PolishCharactersTranslator : IStringTranslator
    {
        private Dictionary<char, char> _translations = new Dictionary<char, char>
        {
            {'ą', 'a'},
            {'Ą', 'A'},
            {'ć', 'c'},
            {'Ć', 'C'},
            {'ę', 'e'},
            {'Ę', 'E'},
            {'ł', 'l'},
            {'Ł', 'L'},
            {'ń', 'n'},
            {'Ń', 'N'},
            {'ó', 'o'},
            {'Ó', 'O'},
            {'ś', 's'},
            {'Ś', 'S'},
            {'ż', 'z'},
            {'Ż', 'Z'},
            {'ź', 'z'},
            {'Ź', 'Z'}
        };

        private string TranslatePolishString(string polishLettersOnly)
        {
            var sb = new StringBuilder(polishLettersOnly.Length);
            foreach (char c in polishLettersOnly)
            {
                sb.Append(_translations[c]);
            }

            return sb.ToString();
        }

        public string TranslatePolishCharsInString(string dirtyString)
        {
            var sb = new StringBuilder(dirtyString.Length);
            foreach (char c in dirtyString)
            {
                if (_translations.ContainsKey(c))
                {
                    sb.Append(_translations[c]);
                }
                else
                {
                    sb.Append(c);
                }
            }

            return sb.ToString();
        }

    }
}
