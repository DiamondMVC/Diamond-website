/**
* Copyright © 2017 Diamond MVC
*/
module models.jsonresponse;

class JsonResponse
{
  public:
  bool success;
  string message;

  this(bool success, string message = null)
  {
    this.success = success;
    this.message = message;
  }
}

class JsonResponseData(T) : JsonResponse
{
  public:
  T data;

  this(bool success, T data, string message = null)
  {
    super(success, message);

    this.data = data;
  }
}
