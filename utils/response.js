
function generalResponse(res, status, message="", data={}){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
      status: status,
      message: message,
      data: data
    });
}

function okResponse(res, data){
    generalResponse(res, 200, "success", data);
}

function internalServerErrorResponse(res){
    generalResponse(res, 500, "Internal Server Error");
}

function badRequestResponse(res, message){
    generalResponse(res, 400, message);
}

function notFoundResponse(res, message){
    generalResponse(res, 404, "Not Found");
}

module.exports = { 
    okResponse,
    internalServerErrorResponse,
    badRequestResponse,
    notFoundResponse
}