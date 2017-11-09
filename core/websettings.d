/**
* Copyright © 2017 Diamond MVC
*/
module websettings;

import diamond.core.websettings;

class DiamondWebSettings : WebSettings
{
  import vibe.d : HTTPServerRequest, HTTPServerResponse, HTTPServerErrorInfo;
  import diamond.http;

  private:
  this()
  {
    super();
  }

  public:
  override void onApplicationStart()
  {
    import diamond.data.i18n;

    loadLanguageFile("en_us", "localization/en_us.lang");
    loadLanguageFile("da", "localization/da.lang");

    setDefaultLanguage("en_us");
  }

  override bool onBeforeRequest(HttpClient client)
  {
    return true;
  }

  override void onAfterRequest(HttpClient client)
  {
  }

  override void onHttpError(Throwable thrownError, HTTPServerRequest request,
    HTTPServerResponse response, HTTPServerErrorInfo error)
  {
    import diamond.core.io;

    print(thrownError.toString());
    response.bodyWriter.write(thrownError.toString());
  }

  override void onNotFound(HTTPServerRequest request, HTTPServerResponse response)
  {
    import std.string : format;
    import diamond.core.io;

    print("The path '%s' wasn't found.'", request.path);
    response.bodyWriter.write(format("The path '%s' wasn't found.'", request.path));
  }

  override void onStaticFile(HttpClient client)
  {

  }
}

void initializeWebSettings()
{
  webSettings = new DiamondWebSettings;
}
