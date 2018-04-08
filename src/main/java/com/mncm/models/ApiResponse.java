package com.mncm.models;

import lombok.Data;

import java.util.*;

@Data
public class ApiResponse {

	private boolean ok;
	private List<ErrorInfo> errors;
	private Map<String,Object> data;

	public void addData(String key, String value) {
        if(this.data == null)
            this.data = new HashMap<>();
        this.data.put(key,value);
	}

	public void addError(String code, String message) {

        if (errors == null)
            errors = new ArrayList<>();

        ErrorInfo errorInfo = new ErrorInfo();
        errorInfo.setCode(code);
		errorInfo.setMessage(message);
        errors.add(errorInfo);
    }

    public void addAll(Map<String,Object> map) {

	    if(this.data==null && map!=null){
          this.data=new HashMap<>();
        }
        if(map!=null && !map.isEmpty())
            this.data.putAll(map);
    }
}
