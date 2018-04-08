package com.mncm.util;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JacksonObjectMapper extends ObjectMapper {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public JacksonObjectMapper(){
        this(true);
    }

    public JacksonObjectMapper(boolean ignoreNull) {
        super();

        if(ignoreNull)
            this.setSerializationInclusion(Include.NON_NULL);
        this.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
}
