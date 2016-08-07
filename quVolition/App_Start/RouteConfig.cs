using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace quVolition {
    public class RouteConfig {
        public static void RegisterRoutes( RouteCollection routes ) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapMvcAttributeRoutes(); // 属性ルーティング用　[Route("api/Volitions/{pId}/{gId}")]
        }
    }
}
