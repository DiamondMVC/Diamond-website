module simplemarkdownparser;

string parseMarkdown(string markdown)
{
  import std.array : replace;
  import std.algorithm : splitter, startsWith, count;
  import std.string : toLower, strip, isNumeric, format, indexOf, lastIndexOf;
  import std.conv : to;

  string result = "";
  bool ul;
  bool ol;
  bool code;

  foreach (input; markdown.replace("\r", "").splitter("\n"))
  {
    if (!input)
    {
      continue;
    }

    if (code)
    {
      if (input.strip() == "```")
      {
        result ~= "</code></pre><br>\r\n";
        code = false;
      }
      else
      {
        result ~= input.replace("<", "&lt;").replace(">", "&gt;") ~ "\r\n";
      }

      continue;
    }

    if (!input.strip().length)
    {
      if (result.length)
      {
        result ~= "<br>\r\n";
      }
      continue;
    }

    auto line = input.strip();

    if (line.startsWith("#"))
    {
      if (ul)
      {
        result ~= "</ul>\r\n";
      }
      else if (ol)
      {
        result ~= "</ol>\r\n";
      }

      ul = false;
      ol = false;

      auto headingCount = line.lastIndexOf('#') + 1;

      auto header = line[headingCount .. $].strip();
      auto id = header.replace(" ", "-").toLower();

      result ~= "<h%d id=\"%s\">%s</h%d>\r\n".format(headingCount, id, header, headingCount);
    }
    else if (line.startsWith("*") && line.length >= 2 && line[1] == ' ')
    {
      if (!ul)
      {
        result ~= "<ul>\r\n";
        ul = true;
      }

      result ~= "<li>%s</li>\r\n".format(line[1 .. $]);
    }
    else if (line == "---")
    {
      result ~= "<hr>\r\n";
    }
    else if (line == "```")
    {
      if (ul)
      {
        result ~= "</ul>\r\n";
      }
      else if (ol)
      {
        result ~= "</ol>\r\n";
      }

      ul = false;
      ol = false;

      result ~= "<pre><code>";
      code = true;
    }
    else
    {
      auto firstDotIndex = line.indexOf('.');

      if (firstDotIndex > 0 && line[0 .. firstDotIndex].strip().isNumeric)
      {
        if (!ol)
        {
          result ~= "<ol>\r\n";
          ol = true;
        }

        result ~= "<li>%s</li>\r\n".format(line[firstDotIndex + 1 .. $]);
      }
      else
      {
        if (ul)
        {
          result ~= "</ul>\r\n";
        }
        else if (ol)
        {
          result ~= "</ol>\r\n";
        }

        ul = false;
        ol = false;

        bool bold;
        bool italic;
        bool underline;

        auto hasBold = line.count("*") > 1 && (line.count("*") % 2 == 0);
        auto hasItalic = line.count("~") > 1 && (line.count("~") % 2 == 0);
        auto hasUnderline = line.count("_") > 1 && (line.count("_") % 2 == 0);

        foreach (c; line)
        {
          if (hasBold && c == '*')
          {
            if (bold)
            {
              result ~= "</span>";
              bold = false;
            }
            else
            {
              result ~= "<span style=\"font-weight: bold;\">";
              bold = true;
            }
          }
          else if (hasItalic && c == '~')
          {
            if (italic)
            {
              result ~= "</span>";
              italic = false;
            }
            else
            {
              result ~= "<span style=\"font-style: italic;\">";
              italic = true;
            }
          }
          else if (hasUnderline && c == '_')
          {
            if (underline)
            {
              result ~= "</span>";
              underline = false;
            }
            else
            {
              result ~= "<span style=\"text-decoration: underline;\">";
              underline = true;
            }
          }
          else
          {
            result ~= to!string(c);
          }
        }

        result ~= "<br>\r\n";
      }
    }
  }

  if (ul)
  {
    result ~= "</ul>\r\n";
  }

  if (ol)
  {
    result ~= "</ol>\r\n";
  }

  return result;
}
