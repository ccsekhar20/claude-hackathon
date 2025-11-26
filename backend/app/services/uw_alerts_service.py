"""
Service for fetching and processing UW Alerts.
"""
import os
import requests
from typing import List, Optional
from bs4 import BeautifulSoup
from app.models.safety import UWAlert
from config import UW_ALERTS_URL, UW_ALERTS_ENABLED


class UWAlertsService:
    """Service for fetching UW Alerts from emergency.uw.edu."""
    
    def __init__(self, alerts_url: Optional[str] = None, enabled: bool = True):
        self.alerts_url = alerts_url or UW_ALERTS_URL
        self.enabled = enabled if enabled is not None else UW_ALERTS_ENABLED
    
    def get_active_alerts(self, location: Optional[dict] = None) -> List[UWAlert]:
        """
        Fetch active UW Alerts.
        
        Args:
            location: Optional location filter {"lat": float, "lng": float, "radius_meters": float}
        
        Returns:
            List of active UWAlert objects
        """
        if not self.enabled:
            return self._get_stub_alerts()
        
        try:
            response = requests.get(self.alerts_url, timeout=10)
            response.raise_for_status()
            
            # Parse HTML to extract alerts
            soup = BeautifulSoup(response.content, 'html.parser')
            alerts = self._parse_alerts_html(soup, location)
            
            return alerts
        
        except (requests.RequestException, Exception) as e:
            # Fallback to stub data on error
            return self._get_stub_alerts()
    
    def _parse_alerts_html(self, soup: BeautifulSoup, location: Optional[dict] = None) -> List[UWAlert]:
        """
        Parse HTML to extract alert information.
        
        This is a basic implementation - adjust based on actual UW Alerts page structure.
        """
        alerts = []
        
        # This is a placeholder - adjust selectors based on actual page structure
        # Look for alert containers, titles, descriptions, etc.
        alert_elements = soup.find_all(['div', 'article'], class_=lambda x: x and 'alert' in x.lower())
        
        for idx, element in enumerate(alert_elements[:5]):  # Limit to 5 alerts
            title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
            title = title_elem.get_text(strip=True) if title_elem else f"Alert {idx + 1}"
            
            desc_elem = element.find(['p', 'div'])
            description = desc_elem.get_text(strip=True) if desc_elem else "No description available"
            
            alert = UWAlert(
                alert_id=f"uw_alert_{idx}",
                title=title,
                description=description,
                severity="medium",
                active=True
            )
            alerts.append(alert)
        
        # If no alerts found, return empty list (or stub for demo)
        if not alerts:
            return self._get_stub_alerts()
        
        return alerts
    
    def _get_stub_alerts(self) -> List[UWAlert]:
        """Return stub alert data for development/testing."""
        return [
            # Example stub - remove or modify for production
            # UWAlert(
            #     alert_id="stub_1",
            #     title="Example Alert",
            #     description="This is a stub alert for development",
            #     severity="low",
            #     active=True
            # )
        ]

