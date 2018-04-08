package com.mncm.util;

import java.io.StringWriter;
import java.util.logging.Logger;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;


public class TemplateService {
	private static Logger log 		  	= Logger.getLogger(TemplateService.class.getPackage().getName());

	
    public static String createTemplate(VelocityContext context, String fileName) throws Exception{

        try{
        
            VelocityEngine ve = new VelocityEngine();
            ve.init();
//            VelocityContext context = new VelocityContext();
//            if(dataList != null)
//                context.put("data",dataList);

            Template t = ve.getTemplate(fileName);
            StringWriter writer = new StringWriter();
            t.merge( context, writer );

            return writer.toString();

        }catch(Exception e){
            log.info(e.getMessage());
        }

        return null;
    }
}
