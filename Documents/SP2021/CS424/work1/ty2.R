library(shiny)
library(shinydashboard)
library(ggplot2)
library(lubridate)
library(DT)
library(jpeg)
library(grid)
library(leaflet)
library(scales)

room <-names(evl2007[ names(evl2007) !="Hour" & names(evl(2007)) != "Date"]) 
             
             
            
ui <- dashboardPage(
   dashboardHeader(title = "Temperature  within 2007 cross months "),
   dashboardSidebar(disable = FALSE, collapsed = FALSE,
                    
                    sidebarMenu(
                      menuItem("", tabName = "cheapBlankSpace", icon = NULL),
                      menuItem("", tabName = "cheapBlankSpace", icon = NULL),
                      menuItem("", tabName = "cheapBlankSpace", icon = NULL)),
                    
                    selectInput("Room1", "Select the year to visualize", room , selected = "S1"),
                    selectInput("Room2", "Select the room to visualize", room, selected = "S2")
  
    ),
)


