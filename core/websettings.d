module websettings;

import diamond.core.websettings;

private class WebdWebSettings : WebSettings
{
  import vibe.d : HTTPServerRequest, HTTPServerResponse, HTTPServerErrorInfo;
  import diamond.http;
  import diamond.authentication;

  private:
  this()
  {
    super();
  }

  public:
  override void onApplicationStart()
  {
    import diamond.data.i18n;

    loadLanguageFile("en", "localization/en_global.lang");
    loadLanguageFile("en", "localization/en_home.lang");
    loadLanguageFile("en", "localization/en_download.lang");
    loadLanguageFile("en", "localization/en_docs.lang");
    loadLanguageFile("en", "localization/en_tutorials.lang");
    loadLanguageFile("en", "localization/en_faq.lang");

    setDefaultLanguage("en");
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
    response.bodyWriter.write(thrownError.toString());
  }

  override void onNotFound(HTTPServerRequest request, HTTPServerResponse response)
  {
    import std.string : format;

    response.bodyWriter.write(format("The path '%s' wasn't found.", request.path));
  }

  override void onStaticFile(HttpClient client)
  {

  }
}

void initializeWebSettings()
{
  webSettings = new WebdWebSettings;
}
