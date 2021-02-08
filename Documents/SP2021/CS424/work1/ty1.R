
library(shiny)
library(shinydashboard)
library(ggplot2)
library(lubridate)
library(DT)
library(jpeg)
library(grid)
library(leaflet)
library(scales)

#evl2007[names(evl2007) =="S2"]
y <- names(evl2007[names(evl2007)!="Date" & names(evl2007)!= "Hour"])
evl2007$newDate <- as.Date(evl2007$Date, "%m/%d/%Y")
#evl2007 <- evl2007[,!(names(evl2007) == "newDate")]
e <- subset(evl2007, month(evl2007$newDate) == 03) 

#t <- rownames(evl2007$newDate, do.NULL = TRUE, prefix = "row")

copy_evl2007 <-evl2007
names(copy_evl2007["S2"])


#ggplot(e, aes(Date))+ geom_smooth(aes(y=S1,group=1,color="S1"))+labs(x="Dates in March",y="temp across rooms") +geom_smooth(aes(y=S2,group=1,color="S2"))+geom_smooth(aes(y=S3,group=1,color="S3"))+ geom_smooth(aes(y=S4,group=1,color="S4"))+ geom_smooth(aes(y=S5,group=1,color="S5")) + geom_smooth(aes(y=S6,group=1,color="S6")) +geom_smooth(aes(y=S7,group=1,color="S7"))





#light <-select(light,-c(newDate))
light<-subset(evl2007,Hour >= 8 & Hour <= 18 & month(evl2007$newDate)==03)

longLight <-melt(light,id.vars= c("Hour","Date"))
longLight$value <- as.numeric(as.character(longLight$value))
ggplot(longLight,aes(x=Date,y=value))+ geom_line(aes(color=variable,group=1)) + facet_wrap(variable ~.) +labs(title="room temperature between 8 & 18hour + only for March")





